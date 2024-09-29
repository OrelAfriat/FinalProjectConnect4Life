const CustomModal = ({ message, onClose }) => {
	return (
		<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
			<div className='relative bg-white p-8 w-1/2 max-w-3xl rounded-lg shadow-lg'>
				<button
					className='absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl'
					onClick={onClose}
				>
					&times;
				</button>
				<p className='text-lg'>{message}</p>
			</div>
		</div>
	);
};

export default CustomModal;
