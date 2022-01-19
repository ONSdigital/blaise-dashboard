import React, { ReactElement} from "react";
//import { Switch, Route, Link } from "react-router-dom";
import {Footer, Header, BetaBanner, NotProductionWarning} from "blaise-design-system-react-components";
import "./style.css";

const divStyle = {
    minHeight: "calc(67vh)",
};

function App(): ReactElement {

    return (
        <>
            {
                (window.location.hostname.includes("dev")) && <NotProductionWarning/>
            }
            <BetaBanner/>
            <Header title={"TO Dashboard"}/>
            <div style={divStyle} className="page__container container">
                <main id="main-content" className="page__main u-mt-no">

                </main>
            </div>
            <Footer/>
        </>
    );
}

export default App;