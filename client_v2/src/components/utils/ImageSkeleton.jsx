import React, { useState } from "react";
import { Skeleton } from "@mui/material";

const ImageCell = ({ src }) => {
	const [isLoading, setIsLoading] = useState(true);

	return (
		<div style={{ width: 50, height: 50, position: "relative" }}>
			{isLoading && (
				<Skeleton variant="rectangular" width={50} height={50} sx={{ position: "absolute", top: 0, left: 0 }} />
			)}
			<img
				src={src}
				alt="Thumbnail"
				style={{
					width: 50,
					height: 50,
					objectFit: "cover",
					borderRadius: 5,
					display: isLoading ? "none" : "block",
				}}
				onLoad={() => setIsLoading(false)}
				onError={() => setIsLoading(false)} // Handle error state if needed
			/>
		</div>
	);
};

export default ImageCell;
