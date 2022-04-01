import Layout from '@/components/Layout';
import Grid from '@/components/Grid';
import { PrismaClient } from '@prisma/client';

//must include export async function getServerSideProps to utilize SSR. Data returned from code within here will be used to pre render pages
// we will have to include logic for fetching data. We can use prisma
export async function getServerSideProps() {
	const prisma = new PrismaClient();
	const homes = await prisma.home.findMany();
	console.log(homes);
	console.log('hello');

	return {
		props: {
			// everytime we fetch from PRISMA, we need to serialize result with the following methodds:
			home: JSON.parse(JSON.stringify(homes)),
		},
	};
}

export default function Home({ homes = [] }) {
	return (
		<Layout>
			<h1 className="text-xl font-medium text-gray-800">
				Top-rated places to stay
			</h1>
			<p className="text-gray-500">
				Explore some of the best places in the world
			</p>
			<div className="mt-8">
				<Grid homes={homes} />
			</div>
		</Layout>
	);
}
