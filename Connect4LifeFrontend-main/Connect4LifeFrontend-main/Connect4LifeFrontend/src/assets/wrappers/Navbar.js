import styled from "styled-components";

const Wrapper = styled.nav`
	background: var(--white);
	.nav-center {
		width: var(--view-width);
		max-width: var(--max-width);
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		padding: 1.5rem 2rem;
		align-items: center;
	}
	.logo {
		font-size: clamp(1.5rem, 3vw, 3rem);
		color: var(--primary-500);
		font-weight: 700;
		letter-spacing: 5px;
	}
	.nav-links {
		display: flex;
		justify-content: space-between; /* Distribute space evenly */
		gap: 0.5rem;
		width: 100%; /* Ensure full width for even distribution */
		max-width: 500px; /* Adjust based on your design */
	}
	.nav-link {
		flex: 1; /* Allow each link to take up equal space */
		text-align: center; /* Center the text within each link */
		color: var(--grey-900);
		padding: 0.5rem 0.5rem 0.5rem 0;
		transition: var(--transition);
		letter-spacing: 2px;
		font-size: 20px;
		white-space: nowrap; /* Prevent text from wrapping */
	}
	.nav-link:hover {
		color: var(--primary-500);
	}
	.active {
		color: var(--primary-500);
	}
	@media (min-width: 768px) {
		.nav-center {
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
		}
		.nav-links {
			flex-direction: row;
			margin-top: 0;
			align-items: center;
		}
	}
`;

export default Wrapper;
