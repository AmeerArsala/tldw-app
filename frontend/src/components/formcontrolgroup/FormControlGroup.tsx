import React from "react";
import "./FormControlGroup.css";

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

export interface FormControlItem {
    component: any;
    label: string;
}

interface FormControlGroupProps {
    items: FormControlItem[];
}

export default function FormControlGroup(props: FormControlGroupProps) {
    const items: FormControlItem[] = props.items;

    return (
        <FormGroup className="form-control-group">
            {items.map((item) => (<FormControlLabel className="form-control-label" control={item.component} label={item.label}/>))}
        </FormGroup>
    );
}