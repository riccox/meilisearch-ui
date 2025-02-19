import { cn } from "@/lib/cn";
import { json } from "@codemirror/lang-json";
import ReactCodeMirror from "@uiw/react-codemirror";
import { useEffect } from "react";
import { useState } from "react";

export const JsonEditor = ({
	defaultValue = "",
	value: controlledValue,
	onChange,
	className,
	autoFocus,
	placeholder,
	readonly = false,
	lineNumbers = true,
}: {
	lineNumbers?: boolean;
	readonly?: boolean;
	placeholder?: string;
	autoFocus?: boolean;
	className?: string;
	defaultValue?: string;
	value?: string;
	onChange: (val: string) => void;
}) => {
	if (controlledValue) {
		return (
			<ReactCodeMirror
				autoFocus={autoFocus}
				className={cn(className, "overflow-scroll")}
				placeholder={placeholder}
				editable={!readonly}
				extensions={[json()]}
				value={controlledValue}
				basicSetup={{
					lineNumbers: lineNumbers,
				}}
				onChange={(val, _viewUpdate) => {
					onChange(val);
				}}
			/>
		);
	}
	const [value, setValue] = useState(defaultValue);

	useEffect(() => {
		onChange(value);
	}, [value, onChange]);

	return (
		<ReactCodeMirror
			autoFocus={autoFocus}
			className={cn(className, "overflow-scroll")}
			placeholder={placeholder}
			editable={!readonly}
			extensions={[json()]}
			value={value}
			basicSetup={{
				lineNumbers: lineNumbers,
			}}
			onChange={(val, _viewUpdate) => {
				setValue(val);
			}}
		/>
	);
};
