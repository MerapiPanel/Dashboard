import React, { useEffect, useState, useRef } from "react";
import { useContainer } from "./container";
import { WidgetAdd } from "./widget-add";
import { Widget } from "./widget";

const SaveButton = () => {

    const { contents, setChanged } = useContainer();

    const saveHandle = () => {

        const contentJson = JSON.stringify(contents.map((item) => item.props));
        __.Widget.fire("save", contentJson)
            .then(() => {
                setChanged(false);
            });
    }

    return (
        <div className="save-button" onClick={saveHandle}>
            <i className="fa-solid fa-floppy-disk"></i>
        </div>
    )
}

export const WidgetContent = ({ children }) => {

    const { endpoint_save, endpoint_load, endpoint_fetch } = window.widgetPayload;
    const { isEdit, contents, setContents, addContent } = useContainer();
    const ref = useRef(null);

    useEffect(() => {
        __.http.get(endpoint_fetch)
            .then((response) => {
                const tempContents = [];
                (response.data || []).forEach((item) => {
                    tempContents.push(<Widget
                        id={item.id}
                        name={item.name}
                        title={item.title}
                        description={item.description || ''}
                        option={item.option || { width: 200, height: 100 }}
                        icon={item.icon || ''} />);
                });
                setContents(tempContents);
            })
    }, [])

    return (
        <div ref={ref} className="widget-content">
            {contents.map((widget, index) => {
                return (
                    <React.Fragment key={index}>
                        {widget}
                    </React.Fragment>
                )
            })}
            <WidgetAdd />
            {isEdit && <SaveButton />}
        </div>
    )
}