import { MediaRoom } from '@/components/media-room';

const Channel = () => {
	return (
		<div>
			{/* <MediaRoom chatId="test" video={false} audio={true} /> */}

			<MediaRoom chatId="test" video={true} audio={true} />
		</div>
	);
};

export default Channel;
