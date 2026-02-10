import React, { useState } from 'react';

const TestCreationForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    section: initialData?.section || 'Listening',
    difficulty: initialData?.difficulty || 'Beginner',
    timeLimit: initialData?.timeLimit || 60,
    ieltsTestType: initialData?.ieltsTestType || 'Academic',
    writingTask: initialData?.writingTask || null,
    questions: initialData?.questions || [
      {
        questionText: '',
        options: ['', ''],
        correctAnswer: '',
        media: '',
        mediaType: 'none',
        questionType: 'mcq',
        speakingPart: null,
        writingTaskType: null,
        minWordCount: null
      }
    ]
  });

  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState(0);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index][field] = value;
    setFormData(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setFormData(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          questionText: '',
          options: ['', ''],
          correctAnswer: '',
          media: '',
          mediaType: 'none',
          questionType: 'mcq',
          speakingPart: null,
          writingTaskType: null,
          minWordCount: null
        }
      ]
    }));
  };

  const removeQuestion = (index) => {
    if (formData.questions.length > 1) {
      const updatedQuestions = [...formData.questions];
      updatedQuestions.splice(index, 1);
      setFormData(prev => ({
        ...prev,
        questions: updatedQuestions
      }));
    }
  };

  const addOption = (questionIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options.push('');
    setFormData(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };

  const removeOption = (questionIndex, optionIndex) => {
    if (formData.questions[questionIndex].options.length > 2) {
      const updatedQuestions = [...formData.questions];
      updatedQuestions[questionIndex].options.splice(optionIndex, 1);
      setFormData(prev => ({
        ...prev,
        questions: updatedQuestions
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Test title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Test description is required';
    }

    if (!formData.section) {
      newErrors.section = 'Test section is required';
    }

    if (!formData.difficulty) {
      newErrors.difficulty = 'Difficulty level is required';
    }

    if (formData.timeLimit <= 0) {
      newErrors.timeLimit = 'Time limit must be greater than 0';
    }

    // Validate questions
    formData.questions.forEach((question, index) => {
      if (!question.questionText.trim()) {
        newErrors[`question_${index}_text`] = 'Question text is required';
      }

      if (question.questionType === 'mcq') {
        if (question.options.some(option => !option.trim())) {
          newErrors[`question_${index}_options`] = 'All options must be filled';
        }
        if (!question.correctAnswer) {
          newErrors[`question_${index}_correct_answer`] = 'Correct answer is required';
        }
      } else if (question.questionType === 'text') {
        // For text questions, we may not need specific validation
      }

      if (question.media && !question.mediaType) {
        newErrors[`question_${index}_media_type`] = 'Media type is required when media is provided';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const sectionOptions = [
    { value: 'Listening', label: 'Listening' },
    { value: 'Reading', label: 'Reading' },
    { value: 'Writing', label: 'Writing' },
    { value: 'Speaking', label: 'Speaking' }
  ];

  const difficultyOptions = [
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {initialData ? 'Edit Test' : 'Create New Test'}
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Test Information */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label">Test Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`form-input ${errors.title ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                placeholder="Enter test title"
              />
              {errors.title && <p className="form-error">{errors.title}</p>}
            </div>

            <div>
              <label className="form-label">Section *</label>
              <select
                value={formData.section}
                onChange={(e) => handleInputChange('section', e.target.value)}
                className={`form-input ${errors.section ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
              >
                {sectionOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              {errors.section && <p className="form-error">{errors.section}</p>}
            </div>

            <div>
              <label className="form-label">Difficulty *</label>
              <select
                value={formData.difficulty}
                onChange={(e) => handleInputChange('difficulty', e.target.value)}
                className={`form-input ${errors.difficulty ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
              >
                {difficultyOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              {errors.difficulty && <p className="form-error">{errors.difficulty}</p>}
            </div>

            <div>
              <label className="form-label">Time Limit (minutes) *</label>
              <input
                type="number"
                value={formData.timeLimit}
                onChange={(e) => handleInputChange('timeLimit', parseInt(e.target.value))}
                className={`form-input ${errors.timeLimit ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                placeholder="Enter time limit in minutes"
                min="1"
              />
              {errors.timeLimit && <p className="form-error">{errors.timeLimit}</p>}
            </div>

            <div>
              <label className="form-label">IELTS Test Type</label>
              <select
                value={formData.ieltsTestType}
                onChange={(e) => handleInputChange('ieltsTestType', e.target.value)}
                className="form-input"
              >
                <option value="Academic">Academic</option>
                <option value="General Training">General Training</option>
              </select>
            </div>

            {formData.section === 'Writing' && (
              <div>
                <label className="form-label">Writing Task</label>
                <select
                  value={formData.writingTask || ''}
                  onChange={(e) => handleInputChange('writingTask', e.target.value ? parseInt(e.target.value) : null)}
                  className="form-input"
                >
                  <option value="">Full Writing Section</option>
                  <option value="1">Task 1 Only</option>
                  <option value="2">Task 2 Only</option>
                </select>
              </div>
            )}
          </div>

          <div className="mt-4">
            <label className="form-label">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`form-input ${errors.description ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
              placeholder="Enter test description"
              rows="4"
            />
            {errors.description && <p className="form-error">{errors.description}</p>}
          </div>
        </div>

        {/* Questions */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Questions</h3>
            <button
              type="button"
              onClick={addQuestion}
              className="btn-primary text-sm py-2 px-4"
            >
              Add Question
            </button>
          </div>

          {formData.questions.map((question, index) => (
            <div key={index} className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-gray-900">Question {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeQuestion(index)}
                  disabled={formData.questions.length <= 1}
                  className="text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="form-label">Question Type</label>
                  <select
                    value={question.questionType}
                    onChange={(e) => handleQuestionChange(index, 'questionType', e.target.value)}
                    className="form-input"
                  >
                    <option value="mcq">Multiple Choice</option>
                    <option value="text">Text Input</option>
                    <option value="speaking">Speaking Test</option>
                    <option value="writing-task1">Writing Task 1</option>
                    <option value="writing-task2">Writing Task 2</option>
                    <option value="listening-mcq">Listening MCQ</option>
                    <option value="reading-mcq">Reading MCQ</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Media Type</label>
                  <select
                    value={question.mediaType}
                    onChange={(e) => handleQuestionChange(index, 'mediaType', e.target.value)}
                    className="form-input"
                  >
                    <option value="none">None</option>
                    <option value="image">Image</option>
                    <option value="audio">Audio</option>
                  </select>
                  {errors[`question_${index}_media_type`] && (
                    <p className="form-error">{errors[`question_${index}_media_type`]}</p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label">Question Text *</label>
                <textarea
                  value={question.questionText}
                  onChange={(e) => handleQuestionChange(index, 'questionText', e.target.value)}
                  className={`form-input ${errors[`question_${index}_text`] ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                  placeholder="Enter question text"
                  rows="3"
                />
                {errors[`question_${index}_text`] && (
                  <p className="form-error">{errors[`question_${index}_text`]}</p>
                )}
              </div>

              {question.mediaType !== 'none' && (
                <div className="mb-4">
                  <label className="form-label">Media URL</label>
                  <input
                    type="text"
                    value={question.media}
                    onChange={(e) => handleQuestionChange(index, 'media', e.target.value)}
                    className="form-input"
                    placeholder="Enter media URL"
                  />
                </div>
              )}

              {/* IELTS Speaking specific fields */}
              {question.questionType === 'speaking' && (
                <div className="mb-4">
                  <label className="form-label">Speaking Part</label>
                  <select
                    value={question.speakingPart || ''}
                    onChange={(e) => handleQuestionChange(index, 'speakingPart', e.target.value ? parseInt(e.target.value) : null)}
                    className="form-input"
                  >
                    <option value="">Select Part</option>
                    <option value="1">Part 1: Introduction & Interview</option>
                    <option value="2">Part 2: Individual Long Turn</option>
                    <option value="3">Part 3: Two-way Discussion</option>
                  </select>
                </div>
              )}

              {/* IELTS Writing specific fields */}
              {(question.questionType === 'writing-task1' || question.questionType === 'writing-task2') && (
                <div className="mb-4">
                  <label className="form-label">Writing Task Type</label>
                  <select
                    value={question.writingTaskType || ''}
                    onChange={(e) => handleQuestionChange(index, 'writingTaskType', e.target.value)}
                    className="form-input"
                  >
                    <option value="">Select Task Type</option>
                    {question.questionType === 'writing-task1' && formData.ieltsTestType === 'Academic' && (
                      <>
                        <option value="academic-graph">Academic: Graph/Chart</option>
                        <option value="academic-process">Academic: Process</option>
                        <option value="academic-map">Academic: Map</option>
                      </>
                    )}
                    {question.questionType === 'writing-task1' && formData.ieltsTestType === 'General Training' && (
                      <option value="general-letter">General Training: Letter</option>
                    )}
                    {question.questionType === 'writing-task2' && (
                      <option value="essay">Essay</option>
                    )}
                  </select>
                </div>
              )}

              {/* Word count requirement */}
              {(question.questionType === 'writing-task1' || question.questionType === 'writing-task2' || question.questionType === 'text') && (
                <div className="mb-4">
                  <label className="form-label">Minimum Word Count</label>
                  <input
                    type="number"
                    value={question.minWordCount || ''}
                    onChange={(e) => handleQuestionChange(index, 'minWordCount', e.target.value ? parseInt(e.target.value) : null)}
                    className="form-input"
                    placeholder="Enter minimum word count"
                    min="0"
                  />
                </div>
              )}

              {question.questionType === 'mcq' && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="form-label">Options</label>
                    <button
                      type="button"
                      onClick={() => addOption(index)}
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      + Add Option
                    </button>
                  </div>

                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                        className={`form-input flex-1 mr-2 ${errors[`question_${index}_options`] ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                        placeholder={`Option ${optionIndex + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeOption(index, optionIndex)}
                        disabled={question.options.length <= 2}
                        className="text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {errors[`question_${index}_options`] && (
                    <p className="form-error">{errors[`question_${index}_options`]}</p>
                  )}

                  <div className="mt-4">
                    <label className="form-label">Correct Answer *</label>
                    <select
                      value={question.correctAnswer}
                      onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
                      className={`form-input ${errors[`question_${index}_correct_answer`] ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                    >
                      <option value="">Select correct answer</option>
                      {question.options.map((option, optionIndex) => (
                        <option key={optionIndex} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {errors[`question_${index}_correct_answer`] && (
                      <p className="form-error">{errors[`question_${index}_correct_answer`]}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Form Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="btn-primary"
          >
            {initialData ? 'Update Test' : 'Create Test'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TestCreationForm;