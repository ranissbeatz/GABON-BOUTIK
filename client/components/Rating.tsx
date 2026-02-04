import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

interface RatingProps {
  value: number;
  text?: string;
  color?: string;
}

const Rating: React.FC<RatingProps> = ({ value, text, color = '#f8e825' }) => {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        <span>
          {value >= 1 ? (
            <FaStar style={{ color }} />
          ) : value >= 0.5 ? (
            <FaStarHalfAlt style={{ color }} />
          ) : (
            <FaRegStar style={{ color }} />
          )}
        </span>
        <span>
          {value >= 2 ? (
            <FaStar style={{ color }} />
          ) : value >= 1.5 ? (
            <FaStarHalfAlt style={{ color }} />
          ) : (
            <FaRegStar style={{ color }} />
          )}
        </span>
        <span>
          {value >= 3 ? (
            <FaStar style={{ color }} />
          ) : value >= 2.5 ? (
            <FaStarHalfAlt style={{ color }} />
          ) : (
            <FaRegStar style={{ color }} />
          )}
        </span>
        <span>
          {value >= 4 ? (
            <FaStar style={{ color }} />
          ) : value >= 3.5 ? (
            <FaStarHalfAlt style={{ color }} />
          ) : (
            <FaRegStar style={{ color }} />
          )}
        </span>
        <span>
          {value >= 5 ? (
            <FaStar style={{ color }} />
          ) : value >= 4.5 ? (
            <FaStarHalfAlt style={{ color }} />
          ) : (
            <FaRegStar style={{ color }} />
          )}
        </span>
      </div>
      {text && <span className="ml-2 text-sm text-gray-600">{text}</span>}
    </div>
  );
};

export default Rating;
