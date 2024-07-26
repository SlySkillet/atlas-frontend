import { IoHome } from 'react-icons/io5';
import { FaSearch } from 'react-icons/fa';
import { GrBeacon } from 'react-icons/gr';
import { CgProfile } from 'react-icons/cg';
import { CgList } from 'react-icons/cg';
import { NavLink } from 'react-router-dom';

const Footer = () => {
    return (
        <div className="flex justify-between bg-gray-800 p-4 text-white">
            <NavLink to="/map" className="flex flex-col items-center">
                <IoHome className="text-3xl" />
                <p className="text-xs">home</p>
            </NavLink>
            <NavLink
                to="/browse-profiles"
                className="flex flex-col items-center"
            >
                <FaSearch className="text-3xl" />
                <p className="text-xs">connect</p>
            </NavLink>
            <NavLink to="/create-beacon" className="flex flex-col items-center">
                <GrBeacon className="bold text-3xl" />
                <p className="text-xs">beacon</p>
            </NavLink>
            <NavLink to="/beaconfeed" className="flex flex-col items-center">
                <CgList className="text-3xl" />
                <p className="text-xs">feed</p>
            </NavLink>
            <NavLink to="/myprofile" className="flex flex-col items-center">
                <CgProfile className="text-3xl" />
                <p className="text-xs">profile</p>
            </NavLink>
        </div>
    );
};

export default Footer;
