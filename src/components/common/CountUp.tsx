import dayjs from "dayjs";
import { useEffect, useState, type FC } from "react";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

interface Props {
	start: Date;
}

export const CountUp: FC<Props> = ({ start }) => {
	const [val, setVal] = useState(dayjs(start).fromNow(true));
	useEffect(() => {
		const interval = setInterval(() => {
			setVal(dayjs(start).fromNow(true));
		}, 1000);
		return () => clearInterval(interval);
	}, [start]);
	return <>{val}</>;
};
