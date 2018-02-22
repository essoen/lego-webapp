// @flow

import { Survey } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import { createSelector } from 'reselect';
import { selectEvents } from './events';
import { omit } from 'lodash';

export type SurveyEntity = {
  id: number,
  title: string,
  event: any,
  activeFrom?: string,
  questions: Array<QuestionEntity>
};

export type QuestionEntity = {
  id: number,
  questionType: string,
  questionText: string,
  mandatory?: boolean,
  options: Array<OptionEntity>,
  relativeIndex: number
};

export type OptionEntity = {
  id: number,
  optionText: string
};

function mutateSurveys(state, action) {
  switch (action.type) {
    case Survey.DELETE.SUCCESS: {
      return {
        ...state,
        items: state.items.filter(id => id !== action.meta.id)
      };
    }

    default:
      return state;
  }
}

export default createEntityReducer({
  key: 'surveys',
  types: {
    fetch: Survey.FETCH,
    mutate: Survey.ADD
  },
  mutate: mutateSurveys
});

export const selectSurveys = createSelector(
  state => state.surveys.items,
  state => state.surveys.byId,
  selectEvents,
  (surveyIds, surveysById, events) => {
    return surveyIds.map(surveyId => ({
      ...surveysById[surveyId],
      event: events.find(event => event.id === surveysById[surveyId].event)
    }));
  }
);

export const selectSurveyById = createSelector(
  (state, props) => selectSurveys(state, props),
  (state, props) => props.surveyId,
  (surveys, surveyId) => {
    const survey = surveys.find(survey => survey.id === surveyId);
    return survey || {};
  }
);

export const selectSurveyTemplates = createSelector(
  (state, props) => selectSurveys(state, props),
  surveys => surveys.filter(survey => survey.templateType)
);

export const selectSurveyTemplate = createSelector(
  (state, props) => selectSurveys(state, props),
  (state, props) => props.templateType,
  (surveys, templateType) => {
    const template = surveys.find(
      survey => survey.templateType === templateType
    );
    if (!template) return false;

    const questions = (template.questions || []).map(question => ({
      ...omit(question, 'id'),
      options: question.options.map(option => omit(option, 'id'))
    }));
    return {
      ...omit(template, ['id', 'event', 'activeFrom', 'templateType']),
      questions
    };
  }
);
