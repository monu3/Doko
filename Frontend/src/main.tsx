import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import { MantineProvider } from "@mantine/core";
import store from "./store";

createRoot(document.getElementById("root")!).render(
  <MantineProvider >
    <Provider store={store}>
      <App />
    </Provider>
  </MantineProvider>
);
