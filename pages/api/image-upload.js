import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';
import { decode } from 'base64-arraybuffer';

const prisma = new PrismaClient();
const supabase = createClient(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_KEY
);

//custom config to allow for larger file size for body parsing of http req
export const config = {
	api: {
		bodyParser: {
			sizeLimit: '10mb',
		},
	},
};

export default async function handler(req, res) {
	// first need to upload to bucket(using supabase JSclient)
	// then retrieve url to post it to an existing entry
	if (req.method === 'POST') {
		try {
			let { image } = req.body;

			if (!image) {
				return res.status(500).json({ message: 'No image provided' });
			}
			// checck that image is encoded in base64
			const contentType = image.match(/data:(.*);base64/)?.[1];
			const base64FileData = image.split('base64,')?.[1];

			if (!contentType || !base64FileData) {
				return res.status(500).json({ message: 'Image data not valid' });
			}

			// creating a custom filename using nanoid
			const fileName = nanoid();
			const ext = contentType.split('/')[1];
			const path = `${fileName}.${ext}`;

			// upload the img to supabase using img(decoded from base64) and filename for path
			const { data, error: uploadError } = await supabase.storage
				.from(process.env.SUPABASE_BUCKET)
				.upload(path, decode(base64FileData), {
					contentType,
					upsert: true,
				});

			if (uploadError) {
				throw new Error('Unable to upload image to storage');
			}

			//build url from data prop returned from inserting
			const url = `${process.env.SUPABASE_URL}/storage/v1/object/public/${data.Key}`;

			return res.status(200).json({ url });
		} catch (e) {
			console.log('Something went wrong');
			res.status(500).json({ message: 'Something went wrong' });
		}
	}

	// HTTP method not supported!
	else {
		res.setHeader('Allow', ['POST']);
		res
			.status(405)
			.json({ message: `HTTP method ${req.method} is not supported.` });
	}
}
