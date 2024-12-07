import React from "react";
import Map from "./Map";

function App() {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="bg-gray-800 text-white py-4">
                <h1 className="text-2xl font-bold text-center">
                    Vehicle Navigation Tracker
                </h1>
            </header>
            <main className="flex-grow ">
                <Map />
            </main>
        </div>
    );
}

export default App;
