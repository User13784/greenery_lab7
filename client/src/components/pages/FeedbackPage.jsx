import React from 'react';
import { Container, Row, Col, Card, Badge, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../hooks/reduxHooks';
import { selectFeedback } from '../../features/feedback/feedbackSlice';

function FeedbackPage() {
  const { t, i18n } = useTranslation();
  const feedback = useAppSelector(selectFeedback);

  const getTranslatedText = (text) => {
    const lang = i18n.language || 'ru';
    if (!text) return '';
    if (typeof text === 'string') return text;
    return text[lang] || text.en || '';
  };

  const getTranslatedProductName = (name) => {
    const lang = i18n.language || 'ru';
    if (!name) return t('product');
    if (typeof name === 'string') return name;
    return name[lang] || name.en || t('product');
  };

  const generateStars = (rating) => {
    let stars = '';
    for (let i = 0; i < 5; i++) {
      stars += i < Math.floor(rating || 5) ? '★' : '☆';
    }
    return stars;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language === 'ru' ? 'ru-RU' : 'en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const avgRating = feedback.length > 0
    ? (feedback.reduce((sum, r) => sum + (r.rating || 0), 0) / feedback.length).toFixed(1)
    : 0;

  return (
    <Container className="py-4">
      <div className="text-center mb-4">
        <h1 className="display-5">{t('reviewsTitle')}</h1>
        <p className="text-muted">{t('reviewsSubtitle')}</p>

        {feedback.length > 0 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap',
              marginTop: '15px'
            }}
          >
            <span
              style={{
                backgroundColor: '#264A51',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                whiteSpace: 'nowrap'
              }}
            >
              {t('totalReviews')} {feedback.length}
            </span>

            <span
              style={{
                backgroundColor: '#FFB800',
                color: '#264A51',
                padding: '8px 16px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                whiteSpace: 'nowrap'
              }}
            >
              {t('avgRating')} {avgRating} ⭐
            </span>
          </div>
        )}
      </div>

      {feedback.length === 0 ? (
        <Alert variant="info" className="text-center">
          <h4>{t('noReviews')}</h4>
          <p>{t('noReviewsHint')}</p>
        </Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {feedback.map(review => (
            <Col key={review.id}>
              <Card className="h-100 shadow-sm">
                <Card.Header
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '10px',
                    flexWrap: 'wrap'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#264A51',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold'
                      }}
                    >
                      {(review.userNickname || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#264A51' }}>
                        {review.userNickname || 'User'}
                      </div>
                      <small style={{ color: '#5a7c85', fontSize: '11px' }}>
                        {formatDate(review.createdAt)}
                      </small>
                    </div>
                  </div>
                </Card.Header>

                <Card.Body>
                  <div style={{ marginBottom: '10px' }}>
                    <span
                      style={{
                        backgroundColor: '#71B3C6',
                        color: 'white',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: '600',
                        display: 'inline-block',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      📦 {getTranslatedProductName(review.productName)}
                    </span>
                  </div>

                  <div
                    style={{
                      color: '#FFB800',
                      fontSize: '18px',
                      marginBottom: '10px',
                      letterSpacing: '2px'
                    }}
                  >
                    {generateStars(review.rating)}
                  </div>

                  <Card.Text style={{ fontSize: '14px', lineHeight: '1.6' }}>
                    {getTranslatedText(review.text)}
                  </Card.Text>
                </Card.Body>

                <Card.Footer style={{ backgroundColor: '#f8fafc', color: '#5a7c85', fontSize: '12px' }}>
                  {t('rating')}: {review.rating} / 5
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default FeedbackPage;