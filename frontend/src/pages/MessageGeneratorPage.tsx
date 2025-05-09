import LinkedInMessageForm from "@/components/LinkedInMessageForm";



const MessageGeneratorPage = () => {
  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">LinkedIn Message Generator</h1>
        <p className="text-muted-foreground">
          Create personalized outreach messages based on LinkedIn profiles
        </p>
      </div>
      
      <LinkedInMessageForm />
    </div>
  );
};

export default MessageGeneratorPage;