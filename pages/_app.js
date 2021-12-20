import PropTypes from 'prop-types';
import Head from 'next/head';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from '../src/createEmotionCache';
import { ThemeProvider } from '@mui/material';
import theme from '../src/theme';
import NextNProgress from '../src/components/NextNProgress';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import zhLocale from 'date-fns/locale/zh-CN'
import '../src/axios'
import { SnackbarUtilsConfigurator } from '../src/notistack'
import { SnackbarProvider } from 'notistack';
import { ConfirmProvider } from 'material-ui-confirm';



// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>我的管理后台</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <LocalizationProvider dateAdapter={AdapterDateFns} locale={zhLocale}>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <NextNProgress />
          <SnackbarProvider maxSnack={3} anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}>
            <SnackbarUtilsConfigurator />
            <ConfirmProvider
              defaultOptions={{
                confirmationText: '确定',
                cancellationText: '取消',
                confirmationButtonProps: { autoFocus: true },
              }}
            >
              <Component {...pageProps} />
            </ConfirmProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </LocalizationProvider>
    </CacheProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};