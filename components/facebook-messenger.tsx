'use client'
import { FacebookProvider, CustomChat } from 'react-facebook';

const FacebookMessenger = () => {
	return (
		<FacebookProvider appId="581157280804465" chatSupport>
			<CustomChat pageId="174241062434285" minimized={true} />
		</FacebookProvider>
	);
};

export default FacebookMessenger;
