import { h } from 'preact';

export const applyHOC = (Component) => (props) => <Component {...props} HOCApplied={true} />
