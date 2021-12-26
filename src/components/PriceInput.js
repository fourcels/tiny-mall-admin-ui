import React from 'react'

const PriceInput = React.forwardRef(function (props, ref) {
    const { onChange, value, ...rest } = props;

    return (
        <input
            {...rest}
            ref={ref}
            value={value && value / 100}
            onChange={(event) => {
                const value = event.target.value
                onChange(value && Math.trunc((value * 100).toPrecision(12)))
            }}
        />
    );
});

export default PriceInput