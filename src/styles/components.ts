import styled from 'vue-styled-components'

export const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: #f9fafb;
  font-family: 'Roboto', system-ui, -apple-system, sans-serif;
`

export const FormCard = styled.div`
  width: 100%;
  max-width: 440px;
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`

export const FormHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`

export const FormLogo = styled.div`
  width: 48px;
  height: 48px;
  margin: 0 auto 1.5rem;
  background: ${props => props.theme.colors.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`

export const FormTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
`

export const FormSubtitle = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
`

export const FormGroup = styled.div`
  margin-bottom: 1.25rem;

  &:last-child {
    margin-bottom: 0;
  }
`

export const AppFooter = styled.div`
  margin-top: 2rem;
  text-align: center;
  padding: 1rem;
  color: #6b7280;
  font-size: 0.875rem;
`

export const FooterLinks = styled.div`
  margin-top: 0.5rem;
  display: flex;
  justify-content: center;
  gap: 1.5rem;
` 