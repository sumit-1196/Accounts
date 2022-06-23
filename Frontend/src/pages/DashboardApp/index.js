import { Grid, Container, Typography } from '@mui/material'
import Page from '../../components/Page'
import AppWidgetSummary from './AppWidgetSummary'

export default function DashboardApp() {
  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Weekly Sales" total={714000} icon={'ant-design:android-filled'} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  )
}
