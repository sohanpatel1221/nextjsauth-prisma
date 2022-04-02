import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import { SessionProvider as AuthProvider } from 'next-auth/react';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
	// Setting the session prop allows session state to be shared between pages
	return (
		<>
			<AuthProvider session={session}>
				<Component {...pageProps} />
			</AuthProvider>
			<Toaster />
		</>
	);
}

export default MyApp;
