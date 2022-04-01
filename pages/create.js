import Layout from '@/components/Layout';
import ListingForm from '@/components/ListingForm';
import axios from 'axios';

const Create = () => {
	// logic to send http post request to server with data

	const addHome = (data) => axios.post('/api/home', data);

	return (
		<Layout>
			<div className="max-w-screen-sm mx-auto">
				<h1 className="text-xl font-medium text-gray-800">List your home</h1>
				<p className="text-gray-500">
					Fill out the form below to list a new home.
				</p>
				<div className="mt-8">
					<ListingForm
						buttonText="Add home"
						redirectPath="/"
						//onSubmit automatically collects the form data into a prop and passes to onSubmit when clicked
						onSubmit={addHome}
					/>
				</div>
			</div>
		</Layout>
	);
};

export default Create;