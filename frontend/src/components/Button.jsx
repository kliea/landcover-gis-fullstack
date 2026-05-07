import React from 'react';
import { Link } from 'react-scroll';

export default function Button({ to, children, ...props }) {
	return (
		// ...spread 
		<Link to={to} {...props}>
			{children}
		</Link> // a html tag
	);
}
