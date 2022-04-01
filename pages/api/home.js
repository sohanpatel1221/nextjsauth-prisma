// endpoint only allows for post requests

import { resetWarningCache } from 'prop-types/checkPropTypes';

export default async function handler(req, res) {
	// Create new home
	if (req.method === 'POST') {
		try {
			const { image, title, description, price, guests, beds, baths } =
				req.body;
			// construct a new home data entry record. prisma abstracts the sql query creation process
			const home = await prisma.home.create({
				data: {
					image,
					title,
					description,
					price,
					guests,
					beds,
					baths,
				},
			});
			res.status(200).json(home);
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
