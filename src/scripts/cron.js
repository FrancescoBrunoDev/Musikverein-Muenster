import { CronJob } from 'cron';
import dotenv from 'dotenv';
import PocketBase from 'pocketbase';

// Carica le variabili d'ambiente
dotenv.config();

const pb = new PocketBase(process.env.POKETBASE);

// Autenticazione come admin
await pb
	.collection('_superusers')
	.authWithPassword(String(process.env.ADMIN_EMAIL), String(process.env.ADMIN_PASSWORD));

const job = new CronJob('* * * * *', async () => {
	try {
		const exhibitionsFiles = await pb.collection('exhibitionsFiles').getFullList({
			filter: 'editingBy > 0'
		});
		console.log('editingBy in corso:', exhibitionsFiles);
		exhibitionsFiles.forEach(async (file) => {
			// Confronta i timestamp in UTC
			const fileUpdateTime = new Date(file.updated).getTime();
			const currentTime = new Date().getTime();

			if (file.editingBy !== '' && fileUpdateTime < currentTime - 300000) {
				await pb.collection('exhibitionsFiles').update(file.id, {
					editingBy: ''
				});
			}
		});
		console.log('editingBy aggiornato alle:', new Date().toUTCString());
	} catch (error) {
		console.error("Errore nell'aggiornamento editingBy:", error);
	}
});

job.start();
