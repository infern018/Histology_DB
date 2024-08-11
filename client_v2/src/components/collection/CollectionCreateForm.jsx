import { useForm } from 'react-hook-form';

const CollectionCreateForm = ({onSubmit}) => {
    const { register, handleSubmit } = useForm();

    const handleFormSubmit = (data) => {
        onSubmit(data);
    }

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <label htmlFor="name">Collection Name:</label>
          <input {...register("name")} required />
          
          <label htmlFor="description">Description:</label>
          <input {...register("description")} required />
          
          <input type="submit" value="Add" />
        </form>
      );
}

export default CollectionCreateForm;
