export function Checkbox({ className = "", checked, onCheckedChange, ...props }) {
    return (
        <input
            type="checkbox"
            className={className}
            checked={checked}
            onChange={(event) => onCheckedChange?.(event.target.checked)}
            {...props}
        />
    );
}
