import os
import json
from pathlib import Path
import itertools
import collections
from dataclasses import dataclass
from enum import Enum
from typing import List

class Language(Enum):
  AR = 'ar'
  EN = 'en'

@dataclass
class Prediction:
  path: str
  languages: List[Language]
  weight: int = 1


predictions = [
  Prediction(
    path='ar-en-easyocr',
    languages=[Language.EN, Language.AR],
    weight=1,
  ),
  Prediction(
    path='en-easyocr',
    languages=[Language.EN],
    weight=1,
  ),
  Prediction(
    path='ar-en5',
    languages=[Language.EN, Language.AR],
    weight=1
  ),
  Prediction(
    path='ar-en4',
    languages=[Language.EN, Language.AR],
    weight=1
  ),
  Prediction(
    path='ar-en3',
    languages=[Language.EN, Language.AR],
    weight=1
  ),
  Prediction(
    path='ar-en3',
    languages=[Language.EN, Language.AR],
    weight=1
  ),
  Prediction(
    path='ar-en2',
    languages=[Language.EN, Language.AR],
    weight=1
  ),
  Prediction(
    path='ar-en',
    languages=[Language.EN, Language.AR],
    weight=1
  ),
  Prediction(
    path='ar',
    languages=[Language.AR],
    weight=1
  ),
  Prediction(
    path='ar2',
    languages=[Language.AR],
    weight=1
  ),
  Prediction(
    path='ar3',
    languages=[Language.AR],
    weight=1
  ),
  Prediction(
    path='ar4',
    languages=[Language.AR],
    weight=1
  ),
  Prediction(
    path='en8',
    languages=[Language.EN],
    weight=1.5
  ),
  Prediction(
    path='en7',
    languages=[Language.EN],
    weight=1.6
  ),
  Prediction(
    path='en6',
    languages=[Language.EN],
    weight=1
  ),
  Prediction(
    path='en5',
    languages=[Language.EN],
    weight=1
  ),
  Prediction(
    path='en4',
    languages=[Language.EN],
    weight=1
  ),
  Prediction(
    path='en3',
    languages=[Language.EN],
    weight=1
  ),Prediction(
    path='en2',
    languages=[Language.EN],
    weight=1
  )
]


def load_json_file(file):
  with open(file, encoding='utf-8') as f:
    return json.loads(f.read())
  

def evaluate_pred(predictions, value='text'):
  c = collections.defaultdict(int)
  for i in predictions:
    c[i[0]] += i[1]
  pred_value, count = next(iter(sorted(c.items(), key=lambda v: v[1], reverse=True)), ('', 0))
  accuracy = min(map(lambda v: v[2], filter(lambda pred: pred[0] == pred_value, predictions))) if pred_value else 0
  votes = len(list(filter(lambda v: v[0] == pred_value, predictions))) / len(predictions) if pred_value else 0
  
  return {value: pred_value, f'{value}_votes': votes, f'{value}_accuracy': accuracy} 

def init_values():
  dir = Path('json_files')
  predictions_dict = {pred.path: pred for pred in predictions}
  predictions_lang = [i.path for i in predictions if not set([Language.EN, Language.AR]).difference(i.languages)]

  for file in dir.iterdir():
    main_json = load_json_file(str(file))
    preds_json = {pred.path: load_json_file(str(Path('predictions') / pred.path / file.name)) for pred in predictions}

    for section, lines in main_json['sections'].items():
      for idx, line in enumerate(lines):
        for word_idx, word in enumerate(line['words']):
          key = f'{section}/{idx}/{word_idx}'
          pred_lang = [(pred_value[key]['lang'], predictions_dict[pred_name].weight, pred_value[key]['accuracy'])
                       for pred_name, pred_value in preds_json.items()
                       if pred_name in predictions_lang and pred_value.get(key) and pred_value[key]['text']]
          word.update(evaluate_pred(pred_lang, 'lang'))

          pred = [(pred_value[key]['text'].replace(' ', ''), predictions_dict[pred_name].weight, pred_value[key]['accuracy'])
                   for pred_name, pred_value in preds_json.items()
                   if pred_value.get(key) and pred_value[key]['lang'] == word['lang'] and pred_value[key]['text']]
          word.update(evaluate_pred(pred, 'text'))
    with open(str(file), 'w', encoding='utf-8') as f:
      json.dump(main_json, f, indent=2, ensure_ascii=False)

if __name__ == '__main__':
  init_values()
