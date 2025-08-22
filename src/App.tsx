import MyForm from "./components/MyForm";
import FormContextProvider from "./context/FormContextProvider";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <FormContextProvider>
        <MyForm />
      </FormContextProvider>
    </ErrorBoundary>
  );
}

export default App;
