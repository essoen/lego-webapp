// @flow

import callAPI from './callAPI';
import { Poll } from './ActionTypes';
import { pollSchema } from '../reducers';
import { addToast } from './ToastActions';
import { push } from 'react-router-redux';
import type { Thunk } from 'app/types';

export function fetchAll({ next = false }: { next: boolean } = {}): Thunk<*> {
  return (dispatch, getState) => {
    const cursor = next ? getState().polls.pagination.next : {};
    return dispatch(
      callAPI({
        types: Poll.FETCH_ALL,
        endpoint: '/polls/',
        schema: [pollSchema],
        query: cursor,
        meta: {
          errorMessage: 'Henting av avstemninger feilet'
        }
      })
    );
  };
}

export function fetchPoll(pollId: number) {
  return callAPI({
    types: Poll.FETCH,
    endpoint: `/polls/${pollId}`,
    schema: pollSchema,
    meta: {
      errorMessage: 'Henting av avstemning feilet'
    }
  });
}

export function createPoll(data: {
  description: string,
  pinned: boolean,
  tags: Array<string>,
  options: Array<Object>
}): Thunk<*> {
  return dispatch =>
    dispatch(
      callAPI({
        types: Poll.CREATE,
        endpoint: '/polls/',
        method: 'POST',
        body: data,
        schema: pollSchema,
        meta: {
          errorMessage: 'Legg til avstemning feilet',
          successMessage: 'Avstemning lagt til!'
        }
      })
    )
      .then(() => addToast({ message: 'Avstemning lagt til' }))
      .then(() => dispatch(push(`/polls/`)));
}

export function editPoll(data: {
  pollId: number,
  description: string,
  pinned: boolean,
  tags: Array<string>,
  options: Array<Object>
}): Thunk<*> {
  return callAPI({
    types: Poll.UPDATE,
    endpoint: `/polls/${data.pollId}/`,
    method: 'PATCH',
    body: data,
    schema: pollSchema,
    meta: {
      errorMessage: 'Endring av avstemning feilet',
      successMessage: 'Avstemning endret'
    }
  });
}

export function deletePoll(pollId: number): Thunk<*> {
  return dispatch =>
    dispatch(
      callAPI({
        types: Poll.DELETE,
        endpoint: `/polls/${pollId}/`,
        method: 'DELETE',
        meta: {
          pollId,
          errorMessage: 'Fjerning av avstemning feilet!'
        }
      })
    )
      .then(() => dispatch(push(`/polls/`)))
      .then(() => fetchAll());
}

export function votePoll(pollId: number, optionId: number) {
  return callAPI({
    types: Poll.UPDATE,
    endpoint: `/polls/${pollId}/vote/`,
    method: 'POST',
    schema: pollSchema,
    body: { optionId },
    meta: {
      pollId,
      optionId,
      errorMessage: 'Avstemning feilet!',
      successMessage: 'Avstemning registrert!'
    }
  });
}