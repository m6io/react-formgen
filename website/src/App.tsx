import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  useLocation,
} from "react-router-dom";
import {
  JsonSchemaExample,
  JsonSchemaComplexExample,
  JsonSchemaCustomRenderTemplateExample,
  JsonSchemaWithRecursiveRefsExample,
  JsonSchemaWithDevToolsExample,
} from "./examples/JsonSchema";
import { YupSchemaExample, YupSchemaComplexExample } from "./examples/Yup";
import { ZodSchemaExample, ZodSchemaComplexExample } from "./examples/Zod";

const links = [
  {
    title: "JSON Schema",
    links: [
      { title: "Simple", path: "/json-schema" },
      { title: "Complex", path: "/json-schema/complex" },
      { title: "Custom Render Template", path: "/json-schema/render-template" },
      { title: "Recursive Refs", path: "/json-schema/recursive-refs" },
      { title: "Devtools", path: "/json-schema/devtools" },
    ],
  },
  {
    title: "Yup Schema",
    links: [
      { title: "Simple", path: "/yup-schema" },
      { title: "Complex", path: "/yup-schema/complex" },
    ],
  },
  {
    title: "Zod Schema",
    links: [
      { title: "Simple", path: "/zod-schema" },
      { title: "Complex", path: "/zod-schema/complex" },
    ],
  },
];

const App = () => {
  const location = useLocation();

  return (
    <div>
      <h1>Form Comparison</h1>
      <nav>
        <ul style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
          {links.map((link) => (
            <li key={link.title}>
              <h2>{link.title}</h2>
              <div style={{ display: "flex" }}>
                {link.links.map((sublink) => {
                  const isRootActive = location.pathname === sublink.path;
                  const isSubpathActive = location.pathname.startsWith(
                    sublink.path
                  );

                  return (
                    <div
                      key={sublink.path}
                      style={{
                        display: "flex",
                        gap: ".5rem",
                        marginRight:
                          link.links.length - 1 !== link.links.indexOf(sublink)
                            ? ".5rem"
                            : "0",
                      }}
                    >
                      <NavLink
                        key={sublink.path}
                        to={sublink.path}
                        style={() => {
                          if (isRootActive) {
                            return {
                              fontWeight: "bold",
                              textDecoration: "underline",
                            };
                          }

                          // Apply styles for subpaths if active, but not for the root
                          if (isSubpathActive && !isRootActive) {
                            return {};
                          }

                          return {};
                        }}
                      >
                        {sublink.title}
                      </NavLink>
                      {link.links.length - 1 !==
                        link.links.indexOf(sublink) && <span>|</span>}
                    </div>
                  );
                })}
              </div>
            </li>
          ))}
        </ul>
      </nav>

      <Routes>
        <Route path="/json-schema" element={<JsonSchemaExample />} />
        <Route
          path="/json-schema/complex"
          element={<JsonSchemaComplexExample />}
        />
        <Route
          path="/json-schema/render-template"
          element={<JsonSchemaCustomRenderTemplateExample />}
        />
        <Route
          path="/json-schema/recursive-refs"
          element={<JsonSchemaWithRecursiveRefsExample />}
        />
        <Route
          path="/json-schema/devtools"
          element={<JsonSchemaWithDevToolsExample />}
        />
        <Route path="/yup-schema" element={<YupSchemaExample />} />
        <Route
          path="/yup-schema/complex"
          element={<YupSchemaComplexExample />}
        />
        <Route path="/zod-schema" element={<ZodSchemaExample />} />
        <Route
          path="/zod-schema/complex"
          element={<ZodSchemaComplexExample />}
        />
      </Routes>
    </div>
  );
};

const RootApp = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

export default RootApp;
