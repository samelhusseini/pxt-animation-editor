import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { MCExtension } from './MCExtension';

declare let module: any

ReactDOM.render(
    <MCExtension />,
    document.getElementById('root') as HTMLElement
);

if (module.hot) {
    module.hot.accept();
} 