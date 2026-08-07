import { Rating, Typography } from "@mui/material";
import { Star } from "@mui/icons-material";

type BarProps = {
    rating: number;
    showText: boolean;
};

const HEALTHBAR_TEXTS = [
    "The patient is in great shape",
    "The patient has a low risk of getting sick",
    "The patient has a high risk of getting sick",
    "The patient has a diagnosed condition",
];

const getColor = (rating: number) => {
    switch (rating) {
        case 0: return "#4caf50"; // verde
        case 1: return "#ffeb3b"; // amarillo
        case 2: return "#ff9800"; // naranjo
        case 3: return "#f44336"; // rojo
        default: return "#9e9e9e";
    }
};

const HealthRatingBar = ({ rating, showText }: BarProps) => {
    return (
        <div className="health-bar">
        <Rating
            readOnly
            value={4 - rating}
            max={4}
            icon={<Star fontSize="inherit" htmlColor={getColor(rating)} />}
            emptyIcon={<Star fontSize="inherit" htmlColor="#ccc" />}
        />
        {showText && (
        <Typography variant="body2" color="textSecondary">
            {HEALTHBAR_TEXTS[rating]}
        </Typography>
        )}
    </div>
    );
};

export default HealthRatingBar;