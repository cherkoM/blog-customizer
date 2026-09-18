import { clsx } from 'clsx';
import { useEffect, useRef, useState } from 'react';
import {
  backgroundColors,
  contentWidthArr,
  defaultArticleState,
  fontColors,
  fontFamilyOptions,
  fontSizeOptions,
} from 'src/constants/articleProps';
import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { RadioGroup } from 'src/ui/radio-group';
import { Select } from 'src/ui/select';
import { Separator } from 'src/ui/separator';
import { Text } from 'src/ui/text';

import type { FormEvent } from 'react';
import type { ArticleStateType, OptionType } from 'src/constants/articleProps';

import styles from './ArticleParamsForm.module.scss';

type ArticleParamsFormProps = {
  onApply: (state: ArticleStateType) => void;
};

export const ArticleParamsForm = ({
  onApply,
}: ArticleParamsFormProps): React.JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [formState, setFormState] = useState<ArticleStateType>(defaultArticleState);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleToggle = (): void => {
    setIsOpen((previousIsOpen) => !previousIsOpen);
  };

  const handleOptionChange = (
    field: keyof ArticleStateType,
    option: OptionType
  ): void => {
    setFormState((previousState) => ({
      ...previousState,
      [field]: option,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onApply(formState);
  };

  const handleReset = (): void => {
    setFormState(defaultArticleState);
    onApply(defaultArticleState);
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleOutsideClick = (event: MouseEvent): void => {
      if (
        event.target instanceof Node &&
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return (): void => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef}>
      <ArrowButton isOpen={isOpen} onClick={handleToggle} />
      <aside
        className={clsx(styles.container, {
          [styles.container_open]: isOpen,
        })}
      >
        <form className={styles.form} onSubmit={handleSubmit} onReset={handleReset}>
          <Text as="h2" size={31} weight={800} uppercase>
            Задайте параметры
          </Text>

          <Select
            title="Шрифт"
            options={fontFamilyOptions}
            selected={formState.fontFamilyOption}
            onChange={(option) => handleOptionChange('fontFamilyOption', option)}
          />

          <RadioGroup
            title="Размер шрифта"
            name="fontSize"
            options={fontSizeOptions}
            selected={formState.fontSizeOption}
            onChange={(option) => handleOptionChange('fontSizeOption', option)}
          />

          <Select
            title="Цвет шрифта"
            options={fontColors}
            selected={formState.fontColor}
            onChange={(option) => handleOptionChange('fontColor', option)}
          />

          <Separator />

          <Select
            title="Цвет фона"
            options={backgroundColors}
            selected={formState.backgroundColor}
            onChange={(option) => handleOptionChange('backgroundColor', option)}
          />

          <Select
            title="Ширина контента"
            options={contentWidthArr}
            selected={formState.contentWidth}
            onChange={(option) => handleOptionChange('contentWidth', option)}
          />

          <div className={styles.bottomContainer}>
            <Button title="Сбросить" htmlType="reset" type="clear" />
            <Button title="Применить" htmlType="submit" type="apply" />
          </div>
        </form>
      </aside>
    </div>
  );
};
