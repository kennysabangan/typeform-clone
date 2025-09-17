import { useEffect } from "react";
import MyForm from "./components/MyForm";
import FormContextProvider from "./context/FormContextProvider";
import ErrorBoundary from "./components/ErrorBoundary";
import { setViewportHeight } from "./utils/viewportFix";

function App() {
  useEffect(() => {
    // Set up viewport height fix on app initialization
    const cleanup = setViewportHeight();
    return cleanup;
  }, []);

  return (
    <ErrorBoundary>
      <FormContextProvider>
        <MyForm />
      </FormContextProvider>
    </ErrorBoundary>
  );
}

export default App;
