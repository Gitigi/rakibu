import os
import json
from pathlib import Path
import itertools
import collections

def load_json_file(file):
  with open(file, encoding='utf-8') as f:
    return json.loads(f.read())
  

def evaluate_pred(preditions, value='text'):
  c = collections.Counter(map(lambda pred: pred[value], preditions))
  pred_value, votes, accuracy = '', 0, 0
  if c:
    pred_value, votes = c.most_common(1)[0]
    votes /= len(preditions)
    accuracy = max(map(lambda v: v['accuracy'], filter(lambda pred: pred[value] == pred_value, preditions)))
  
  return {value: pred_value, f'{value}_votes': votes, f'{value}_accuracy': accuracy} 

def init_values():
  dir = Path('json_files')
  models = [Path('fontsize-48'), Path('fontsize-52')]
  for file in dir.iterdir():
    main_json = load_json_file(str(file))
    models_json = list(map(lambda m: load_json_file(str(m / file.name)), models))
    for section, lines in main_json['sections'].items():
      for idx, line in enumerate(lines):
        for word_idx, word in enumerate(line['words']):
          key = f'{section}/{idx}/{word_idx}'
          pred = map(lambda m: m.get(key), models_json)
          pred = list(filter(lambda v: v, pred))
          word.update(evaluate_pred(pred, 'text'))
          word.update(evaluate_pred(pred, 'lang'))
    with open(str(file), 'w', encoding='utf-8') as f:
      f.write(json.dumps(main_json, indent=2, ensure_ascii=False))


    

def get_lines(data, name):
  for section, value in data['sections'].items():
    for idx, line in enumerate(value):
      words = [
        {'name': name, 'section': section, 'line_index': idx, 'index': word_idx,  **word}
        for word_idx, word in enumerate(line['words'])
      ]
      yield {'name': name, 'section': section, 'index': idx, 'bbox': line['bbox'], 'words': words}

def read_main_json():
  dir = Path('json_files')
  lines = []
  for path in sorted(dir.iterdir()):
    data = load_json_file(str(path))
    name = path.name.split('.')[0]
    lines.extend(get_lines(data, name))
  
  words = list(itertools.chain(*map(lambda v: v['words'], lines)))
  return lines, words
    
