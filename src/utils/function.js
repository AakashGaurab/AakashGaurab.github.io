export const fileDownloader = (name, fileLink) => {
  const link = document.createElement("a");
  link.download = name;
  link.href = `/${name}`;
  link.setAttribute("class", "resume-link-2");
  link.click();

  window.open(fileLink, "_blank");
};

export const customAnchor = (href) => {
  const link = document.createElement("a");
  link.href = href;
  link.setAttribute("class", "resume-link-2");
  link.click();
};

export const parseBoldText = (text) => {
  const parts = text.split(/(\*.*?\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <b className="bold-text" key={index}>
          {part.slice(1, -1)}
        </b>
      );
    }
    return <span key={index}>{part}</span>;
  });
};
