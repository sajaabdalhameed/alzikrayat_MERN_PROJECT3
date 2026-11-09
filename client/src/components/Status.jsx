// Shared loading / error feedback states.
export const Loading = () => <p className="text-muted">Loading...</p>;
export const ErrorMsg = ({ message }) => message ? <div className="alert alert-danger">{message}</div> : null;
