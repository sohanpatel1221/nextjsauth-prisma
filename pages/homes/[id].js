import Image from 'next/image';
import Layout from '@/components/Layout';
import { PrismaClient } from '@prisma/client';
import { useRouter } from 'next/router';

// when param is being assigned a value, that is default value in case no args get passed or args are undefined

// before specifying getStaticProps, we must specify paths of pages
// we want to statically generate since this is a dynamic route

const prisma = new PrismaClient();

export async function getStaticPaths() {
	// prisma.home.findMany retrieves all records of rows
	// specifying filter, returns only the fields we need ( in this case id)
	const homes = await prisma.home.findMany({
		select: { id: true },
	});

	// return object {} with a paths property. paths contains an array of pages objects that we want to pre render
	// we specify the page with the params property which is the query params of dynamic route

	return {
		paths: homes.map((home) => ({
			params: { id: home.id },
		})),
		//setting this to true, turns on incremental static generation
		// we must specify a conditional branch witin our main compoent to load an ISR page if it is requestd, since it will be loading while we fetch data
		fallback: true,
	};
}
// {} around param is destructuring. destructures props object and only passes in params into getStaticProps
export async function getStaticProps({ params }) {
	// Get the current home from the database
	const home = await prisma.home.findUnique({
		where: { id: params.id },
	});

	if (home) {
		return {
			props: JSON.parse(JSON.stringify(home)),
		};
	}

	return {
		redirect: {
			destination: '/',
			permanent: false,
		},
	};
}

const ListedHome = (home = null) => {
	const router = useRouter();

	// if Fallback version is loading it can be detected via router.isFallback prop
	if (router.isFallback) {
		return 'Loading...';
	}

	return (
		<Layout>
			<div className="max-w-screen-lg mx-auto">
				<div className="flex flex-col sm:flex-row sm:justify-between sm:space-x-4 space-y-4">
					<div>
						<h1 className="text-2xl font-semibold truncate">
							{home?.title ?? ''}
						</h1>
						<ol className="inline-flex items-center space-x-1 text-gray-500">
							<li>
								<span>{home?.guests ?? 0} guests</span>
								<span aria-hidden="true"> · </span>
							</li>
							<li>
								<span>{home?.beds ?? 0} beds</span>
								<span aria-hidden="true"> · </span>
							</li>
							<li>
								<span>{home?.baths ?? 0} baths</span>
							</li>
						</ol>
					</div>
				</div>

				<div className="mt-6 relative aspect-video bg-gray-200 rounded-lg shadow-md overflow-hidden">
					{home?.image ? (
						<Image
							src={home.image}
							alt={home.title}
							layout="fill"
							objectFit="cover"
						/>
					) : null}
				</div>

				<p className="mt-8 text-lg">{home?.description ?? ''}</p>
			</div>
		</Layout>
	);
};

export default ListedHome;
