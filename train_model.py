from pathlib import Path

import joblib
import pandas as pd
from sklearn.metrics import classification_report
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split


def build_spam_samples():
    # Jigsaw has no spam class, so we keep a focused synthetic spam set.
    return [
        "Buy now and get 90 percent off",
        "Limited time offer click here now",
        "Win a free iPhone by visiting this link",
        "Earn money fast from home guaranteed",
        "Congratulations you won claim your prize now",
        "Subscribe now for instant rewards",
        "Click this link to get rich quickly",
        "Exclusive deal only today don't miss out",
        "Get followers instantly buy now",
        "Cheap loans approved in minutes apply now",
        "Free gift card claim now",
        "Winner winner click to collect",
        "Act now special promotion",
        "Huge sale ends tonight click now",
        "Get paid daily no skills needed",
        "Claim your bonus immediately",
        "Limited offer apply today",
        "Best crypto signal join now",
        "Get 10x return click now",
        "Free recharge click this link",
    ]


def build_safe_samples():
    return [
        "how are you sir",
        "hello",
        "good morning",
        "good evening",
        "have a nice day",
        "thank you very much",
        "you are welcome",
        "how can I help you",
        "this is great",
        "nice to meet you",
        "what is your name",
        "I am doing well",
        "please let me know",
        "how is the weather",
        "I like this",
        "good job",
        "well done",
        "see you later"
    ]

def load_labeled_data():
    dataset_path = Path(__file__).resolve().parent / "train.csv"
    if not dataset_path.exists():
        raise FileNotFoundError(f"train.csv not found at {dataset_path}")

    print(f"Loading dataset from {dataset_path}")
    df = pd.read_csv(dataset_path)

    required_cols = {
        "comment_text",
        "toxic",
        "severe_toxic",
        "obscene",
        "threat",
        "insult",
        "identity_hate",
    }
    missing = required_cols - set(df.columns)
    if missing:
        raise ValueError(f"Missing expected columns: {sorted(missing)}")

    df["comment_text"] = df["comment_text"].fillna("").astype(str)

    # Map Jigsaw multi-label columns into project categories.
    df["label"] = "Safe"
    profanity_mask = df["obscene"] == 1
    toxic_mask = (
        (df["toxic"] == 1)
        | (df["severe_toxic"] == 1)
        | (df["threat"] == 1)
        | (df["insult"] == 1)
        | (df["identity_hate"] == 1)
    ) & (~profanity_mask)

    df.loc[profanity_mask, "label"] = "Profanity"
    df.loc[toxic_mask, "label"] = "Toxic"

    # Reduce heavy Safe imbalance so model learns unsafe classes better.
    safe_df = df[df["label"] == "Safe"]
    unsafe_df = df[df["label"] != "Safe"]
    safe_keep = min(len(safe_df), len(unsafe_df) * 3)
    safe_df = safe_df.sample(n=safe_keep, random_state=42)
    balanced_df = pd.concat([safe_df, unsafe_df], ignore_index=True)

    spam_df = pd.DataFrame(
        {"comment_text": build_spam_samples() * 250, "label": "Spam"}
    )
    
    extra_safe_df = pd.DataFrame(
        {"comment_text": build_safe_samples() * 250, "label": "Safe"}
    )

    final_df = pd.concat(
        [balanced_df[["comment_text", "label"]], spam_df, extra_safe_df], ignore_index=True
    ).sample(frac=1.0, random_state=42)

    print("Label distribution:")
    print(final_df["label"].value_counts())
    return final_df["comment_text"].tolist(), final_df["label"].tolist()


def train():
    texts, labels = load_labeled_data()
    print(f"Training on {len(texts)} samples...")

    x_train, x_valid, y_train, y_valid = train_test_split(
        texts,
        labels,
        test_size=0.15,
        random_state=42,
        stratify=labels,
    )

    pipeline = Pipeline(
        [
            (
                "tfidf",
                TfidfVectorizer(
                    lowercase=True,
                    ngram_range=(1, 2),
                    min_df=2,
                    max_df=0.98,
                    strip_accents="unicode",
                    sublinear_tf=True,
                ),
            ),
            (
                "clf",
                LogisticRegression(
                    max_iter=3000,
                    class_weight="balanced",
                    solver="lbfgs",
                ),
            ),
        ]
    )

    pipeline.fit(x_train, y_train)
    y_pred = pipeline.predict(x_valid)
    print("\nValidation report:")
    print(classification_report(y_valid, y_pred, digits=4))

    output_path = Path(__file__).resolve().parent / "backend" / "model.joblib"
    joblib.dump(pipeline, output_path)
    print(f"Model successfully trained and saved as {output_path}")

if __name__ == "__main__":
    train()
