import { CronJob } from 'cron';
import dotenv from 'dotenv';
import PocketBase from 'pocketbase';

// Carica le variabili d'ambiente
dotenv.config();

const pb = new PocketBase(process.env.POKETBASE);
pb.autoCancellation(false);

// Verifica che le credenziali siano presenti
if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
	console.warn('⚠️  ADMIN_EMAIL or ADMIN_PASSWORD not set. Cron job will not run.');
	process.exit(0);
}

// Autenticazione come admin
try {
	await pb
		.collection('_superusers')
		.authWithPassword(String(process.env.ADMIN_EMAIL), String(process.env.ADMIN_PASSWORD));
	console.log('✅ Authenticated with PocketBase');
} catch (error) {
	console.error('❌ Failed to authenticate with PocketBase:', error.message);
	console.warn('⚠️  Cron job will not run due to authentication failure.');
	process.exit(0);
}

const job = new CronJob('* * * * *', async () => {
	try {
		const exhibitionsFiles = await pb.collection('exhibitionsFiles').getFullList({
			filter: 'editingBy > 0',
			autoCancellation: false
		});
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
