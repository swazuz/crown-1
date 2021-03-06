import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './delivery.reducer';
import { IDelivery } from 'app/shared/model/delivery.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IDeliveryUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const DeliveryUpdate = (props: IDeliveryUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { deliveryEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/delivery');
  };

  useEffect(() => {
    if (!isNew) {
      props.getEntity(props.match.params.id);
    }
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...deliveryEntity,
        ...values
      };

      if (isNew) {
        props.createEntity(entity);
      } else {
        props.updateEntity(entity);
      }
    }
  };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="crownApp.delivery.home.createOrEditLabel">
            <Translate contentKey="crownApp.delivery.home.createOrEditLabel">Create or edit a Delivery</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : deliveryEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="delivery-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="delivery-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="deliveryContactLabel" for="delivery-deliveryContact">
                  <Translate contentKey="crownApp.delivery.deliveryContact">Delivery Contact</Translate>
                </Label>
                <AvField
                  id="delivery-deliveryContact"
                  type="text"
                  name="deliveryContact"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="phoneNumberLabel" for="delivery-phoneNumber">
                  <Translate contentKey="crownApp.delivery.phoneNumber">Phone Number</Translate>
                </Label>
                <AvField
                  id="delivery-phoneNumber"
                  type="text"
                  name="phoneNumber"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="notesLabel" for="delivery-notes">
                  <Translate contentKey="crownApp.delivery.notes">Notes</Translate>
                </Label>
                <AvField id="delivery-notes" type="text" name="notes" />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/delivery" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </AvForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  deliveryEntity: storeState.delivery.entity,
  loading: storeState.delivery.loading,
  updating: storeState.delivery.updating,
  updateSuccess: storeState.delivery.updateSuccess
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(DeliveryUpdate);
