import React from "react";
import { Skeleton, Card, CardContent } from "@mui/material";

const CardSkeleton = () => {
	return (
		<Card
			sx={{
				padding: "20px",
				marginTop: "20px",
				width: "1000px",
				background: "rgba(255, 255, 255, 0.8)",
			}}>
			<CardContent>
				<Skeleton variant="text" height={40} />
				<Skeleton variant="rectangular" height={200} sx={{ marginTop: 2, marginBottom: 2 }} />
				<Skeleton variant="text" height={20} />
				<Skeleton variant="text" height={20} width="80%" />
			</CardContent>
		</Card>
	);
};

export default CardSkeleton;
