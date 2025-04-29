import {
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

export default function PrivacyPolicy({ open, handleCancel, handleAccept }) {
  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      PaperProps={{
        style: { maxWidth: 600 },
      }}
    >
      <DialogTitle>
        <Typography variant="h4" color="primary" gutterBottom>
          MERNTube Terms of Use
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Last Updated: April 30, 2025
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" paragraph>
          These Terms of Use ("Terms") govern your use of the MernTube
          application ("App"), operated by Ashish Dhami ("we," "us," or "our").
          By accessing or using MernTube, you agree to these Terms. If you do
          not agree, do not use the App.
        </Typography>
        <Typography variant="h6" gutterBottom>
          1. Acceptance of Terms
        </Typography>
        <Typography variant="body1" paragraph>
          By using MernTube, you confirm you are at least 13 years old and agree
          to these Terms and our Privacy Policy. Users under 18 must have
          parental consent.
        </Typography>
        <Typography variant="h6" gutterBottom>
          2. User Accounts
        </Typography>
        <Typography variant="body1" paragraph>
          - Provide accurate information when creating an account.
          <br />
          - Keep your account credentials confidential and report unauthorized
          use immediately.
          <br />- You are responsible for all activities under your account.
        </Typography>
        <Typography variant="h6" gutterBottom>
          3. User Content
        </Typography>
        <Typography variant="body1" paragraph>
          - You may upload, share, or stream videos ("User Content"). You grant
          MernTube a worldwide, non-exclusive, royalty-free license to use,
          host, and display it to operate the App.
          <br />
          - Do not upload illegal, harmful, defamatory, obscene, or infringing
          content.
          <br />- We may remove content violating these Terms.
        </Typography>
        <Typography variant="h6" gutterBottom>
          4. User Conduct
        </Typography>
        <Typography variant="body1" paragraph>
          You agree not to:
          <br />
          - Use MernTube for illegal purposes.
          <br />
          - Disrupt or interfere with the App’s functionality.
          <br />
          - Attempt unauthorized access to systems or accounts.
          <br />- Harass or harm other users.
        </Typography>
        <Typography variant="h6" gutterBottom>
          5. Intellectual Property
        </Typography>
        <Typography variant="body1" paragraph>
          - MernTube’s logos, designs, and content (excluding User Content) are
          our property, protected by copyright and trademark laws.
          <br />- Do not reproduce or distribute our intellectual property
          without permission.
        </Typography>
        <Typography variant="h6" gutterBottom>
          6. Termination
        </Typography>
        <Typography variant="body1" paragraph>
          - We may suspend or terminate your account for violating these Terms
          or at our discretion.
          <br />- You may delete your account via the App’s settings.
        </Typography>
        <Typography variant="h6" gutterBottom>
          7. Modifications
        </Typography>
        <Typography variant="body1" paragraph>
          We may update these Terms. Continued use after changes means you
          accept the new Terms.
        </Typography>
        <Typography variant="h6" gutterBottom>
          8. Contact
        </Typography>
        <Typography variant="body1" paragraph>
          For questions, contact [ashishdhami12@gmail.com].
        </Typography>
        <Typography variant="body1" paragraph>
          By using MernTube, you agree to these Terms of Use.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleAccept} color="primary" variant="contained">
          Accept
        </Button>
      </DialogActions>
    </Dialog>
  );
}
