import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
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

export function useWindowSize(): {
  width: number | null;
  height: number | null;
} {
  const [size, setSize] = React.useState<{
    width: number | null;
    height: number | null;
  }>({
    width: null,
    height: null,
  });

  React.useLayoutEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return size;
}

const Redirect = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/json-schema");
  }, [navigate]);
  return null;
};

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const size = useWindowSize();

  // State variables for the selected schema type and subpath
  const [selectedSchemaType, setSelectedSchemaType] = useState("");
  const [selectedSubpath, setSelectedSubpath] = useState("");

  // Update state based on the current location
  useEffect(() => {
    // Find the schema type and subpath based on the current path
    const currentLink = links.find((link) =>
      link.links.some((sublink) => sublink.path === location.pathname)
    );

    if (currentLink) {
      setSelectedSchemaType(currentLink.title);
      const currentSublink = currentLink.links.find(
        (sublink) => sublink.path === location.pathname
      );
      setSelectedSubpath(currentSublink?.title || currentLink.links[0].title);
    } else {
      // Default to the first schema type and subpath if no match
      setSelectedSchemaType(links[0].title);
      setSelectedSubpath(links[0].links[0].title);
    }
  }, [location]);

  // Get the subpaths for the selected schema type
  const currentSchemaTypeLinks = links.find(
    (link) => link.title === selectedSchemaType
  );

  const handleSchemaTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSchemaTypeTitle = e.target.value;
    setSelectedSchemaType(newSchemaTypeTitle);

    // Get the first subpath of the new schema type
    const newSchemaType = links.find(
      (link) => link.title === newSchemaTypeTitle
    );
    if (newSchemaType) {
      const newSubpath = newSchemaType.links[0];
      setSelectedSubpath(newSubpath.title);
      navigate(newSubpath.path);
    }
  };

  const handleSubpathChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSubpathTitle = e.target.value;
    setSelectedSubpath(newSubpathTitle);

    // Get the path for the selected schema type and subpath
    const schemaType = links.find((link) => link.title === selectedSchemaType);
    if (schemaType) {
      const subpath = schemaType.links.find(
        (sublink) => sublink.title === newSubpathTitle
      );
      if (subpath) {
        navigate(subpath.path);
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem",
        }}
      >
        <h3>@react-formgen</h3>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            width:
              size.width && size.width > 640 ? "max-content" : "min-content",
          }}
        >
          <select
            style={{
              width: "12rem",
              padding: "8px",
              border: "1px solid #d1d5db",
              borderRadius: "0.375rem",
              boxSizing: "border-box",
            }}
            value={selectedSchemaType}
            onChange={handleSchemaTypeChange}
          >
            {links.map((link) => (
              <option key={link.title} value={link.title}>
                {link.title}
              </option>
            ))}
          </select>

          <select
            style={{
              width: "12rem",
              padding: "8px",
              border: "1px solid #d1d5db",
              borderRadius: "0.375rem",
              boxSizing: "border-box",
            }}
            value={selectedSubpath}
            onChange={handleSubpathChange}
          >
            {currentSchemaTypeLinks &&
              currentSchemaTypeLinks.links.map((sublink) => (
                <option key={sublink.title} value={sublink.title}>
                  {sublink.title}
                </option>
              ))}
          </select>
        </div>
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
        <Route path="*" element={<Redirect />} />
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
