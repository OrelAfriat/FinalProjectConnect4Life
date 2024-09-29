import styled from "styled-components";

const Wrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 100vh;
	background-color: #f4f4f4;
	color: #333;
	font-family: "Arial", sans-serif;

	.construction-content {
		text-align: center;
		padding: 20px;
		border: 2px dashed #ff9900;
		border-radius: 10px;
	}

	.construction-content h1 {
		font-size: 5em;
		color: #e67e22;
	}

	.construction-content p {
		font-size: 1.2em;
		color: #34495e;
	}
`;

export default Wrapper;
