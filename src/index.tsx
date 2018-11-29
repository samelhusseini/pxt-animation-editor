import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { AppContainer } from 'react-hot-loader';
import { MCExtension } from './MCExtension';

declare let module: any

ReactDOM.render(
    <AppContainer>
        <MCExtension />
    </AppContainer>,
    document.getElementById('root') as HTMLElement
);

if (module.hot) {
    module.hot.accept();
} 