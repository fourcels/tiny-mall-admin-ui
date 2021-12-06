import { GlobalStyles } from '@mui/material';
import { useRouter } from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'
import React from 'react';

export default function NextNProgress() {
    const router = useRouter();
    React.useEffect(() => {
        const nProgressStart = () => NProgress.start();
        const nProgressDone = () => NProgress.done();

        router.events.on('routeChangeStart', nProgressStart);
        router.events.on('routeChangeComplete', nProgressDone);
        router.events.on('routeChangeError', nProgressDone);
        return () => {
            router.events.off('routeChangeStart', nProgressStart);
            router.events.off('routeChangeComplete', nProgressDone);
            router.events.off('routeChangeError', nProgressDone);
        };
    }, [router]);
    return (
        <GlobalStyles styles={(theme) => ({
            '#nprogress': {
                '& .bar, & .spinner': {
                    zIndex: theme.zIndex.tooltip,
                }
            }
        })} />
    )
}