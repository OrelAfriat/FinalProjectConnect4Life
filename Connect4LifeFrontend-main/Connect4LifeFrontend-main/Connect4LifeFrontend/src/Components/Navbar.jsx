import { NavLink } from "react-router-dom";
import Wrapper from "../assets/wrappers/Navbar";
import { useState } from "react";
import NewTaskModal from "../Pages/NewTask/AddNewTask";
import { useContext } from "react";
import { UserContext } from "./UserContext";
import { useEffect } from "react";
const Navbar = () => {
	const { logout, user } = useContext(UserContext);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isUserAdmin, setIsUserAdmin] = useState(true);

	useEffect(() => {
		if (user?.username === "admin") {
			setIsUserAdmin(true);
			console.log(isUserAdmin);
		} else {
			setIsUserAdmin(false);
		}
	}, [user]);

	const openModal = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	const handleLogout = () => {
		logout();
	};

	return (
		<Wrapper>
			<div className='nav-center'>
				<span className='logo'>Connect4Life</span>
				<div className='nav-links'>
					<NavLink to='overview' className='nav-link'>
						Overview
					</NavLink>
					{isUserAdmin && (
						<button onClick={openModal} className='nav-link'>
							Create Task
						</button>
					)}
					{isModalOpen && <NewTaskModal onClose={closeModal} />}
					<NavLink to='myTasks' className='nav-link'>
						My Tasks
					</NavLink>
					<NavLink to='about' className='nav-link'>
						Statistics
					</NavLink>
				</div>
				<button
					onClick={handleLogout}
					className='logout-btn absolute top-4 right-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
				>
					Logout
				</button>
			</div>
		</Wrapper>
	);
};

export default Navbar;
