import PocketBase from 'pocketbase';
import { config as dotenv } from 'dotenv';
import { mkdir, writeFile } from 'fs/promises';
import { EventSource } from 'eventsource';
import { join } from 'path';

// Carica le variabili d'ambiente
dotenv();

// Aggiungi EventSource al global scope
global.EventSource = EventSource;

const pb = new PocketBase(process.env.POKETBASE);
const CACHE_DIR = 'src/.mdcache';

const syncMd = async () => {
    try {
        // Autentica
        await pb
            .collection('_superusers')
            .authWithPassword(String(process.env.ADMIN_EMAIL), String(process.env.ADMIN_PASSWORD));

        // Sottoscrivi ai cambiamenti
        const unsubscribe = pb.collection('exhibitionsFiles').subscribe("*", async function (e) {
            console.log("[syncMd]", e.record.id, "changed");
            console.log("action:", e.action);
            const url = pb.files.getURL(e.record, e.record.preview);
            const response = await fetch(url);
            const content = await response.text();
            const cachePath = join(CACHE_DIR, e.record.lang, `${e.record.id}.md`);
            await writeFile(cachePath, content);
            console.log("[syncMd]", e.record.id, "synced");
        });

        // Gestione pulizia
        process.on('SIGINT', async () => {
            (await unsubscribe)();
            process.exit(0);
        });

    } catch (error) {
        console.error('Errore durante la sincronizzazione:', error);
        process.exit(1);
    }
}

const firstStart = async () => {
    console.log("[syncMd] Start sync");
    try {
        let exhibitionsFiles = await pb.collection('exhibitionsFiles').getFullList();

        await mkdir(CACHE_DIR, { recursive: true });

        for (let file of exhibitionsFiles) {
            await mkdir(join(CACHE_DIR, file.lang), { recursive: true });
            const url = pb.files.getURL(file, file.preview);
            const response = await fetch(url);
            const content = await response.text();
            const cachePath = join(CACHE_DIR, file.lang, `${file.id}.md`);
            await writeFile(cachePath, content);
        }

    } catch (error) {
        console.error('Errore durante il primo avvio:', error);
        process.exit(1);
    }
}


firstStart().then(syncMd);